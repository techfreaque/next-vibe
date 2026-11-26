import { describe,expect,it } from "bun:test";
import { mkdir, mkdtemp, rename, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { generateKeyPairSync,verify } from "node:crypto";

import { readBankSigningKey } from "../env";
import { createEnableBankingAdapter } from "./adapter";
import { applicationAccess } from "./application";
import { createEnableBankingTransport } from "./http";

const pair=generateKeyPairSync("rsa",{modulusLength:2048});
const pem=pair.privateKey.export({type:"pkcs8",format:"pem"}).toString();
const app="27c89fa6-4dfb-4fca-83c2-2697ea2910bc";
const range={from:"2026-01-01",to:"2026-01-10"};
describe("Enable Banking read access",()=>{
  it("uses inline and base64 RSA keys and refuses bad signing material",()=>{
    for(const key of [pem,pem.replaceAll("\n","\\n"),Buffer.from(pem).toString("base64")]) {
      expect(readBankSigningKey(key,undefined) === pem.trim()).toBe(true);
    }
    expect(readBankSigningKey("invalid secret",undefined)).toBeNull();
    expect(readBankSigningKey(undefined,import.meta.filename)).toBeNull();
  });
  it("loads a signing key from a self-hosted PEM file", async () => {
    await mkdir(".tmp", { recursive: true });
    const directory = await mkdtemp(".tmp/synthetic-bank-key-");
    const archive = ".tmp/todelete/bank-signing-key-test";
    try {
      const path = join(directory, "synthetic.pem");
      await writeFile(path, pem, { mode: 0o600 });
      expect(readBankSigningKey(undefined, path) === pem.trim()).toBe(true);
    } finally {
      await mkdir(archive, { recursive: true });
      await rename(directory, join(archive, basename(directory)));
    }
  });
  it("reads app status with a signed JWT, follows no redirects and never guesses session identifiers",async()=>{
    const paths:string[]=[];
    const signed=createEnableBankingTransport(app,pem,async(url,init)=>{
      paths.push(url.pathname);
      expect(url.origin).toBe("https://api.enablebanking.com");
      expect(init.redirect).toBe("error");
      const token=new Headers(init.headers).get("authorization")?.slice(7).split(".") ?? [];
      expect(token.length).toBe(3);
      expect(verify("RSA-SHA256",Buffer.from(token.slice(0,2).join(".")),pair.publicKey,Buffer.from(token[2] ?? "","base64url"))).toBe(true);
      return Response.json({active:true,services:["AIS"],environment:"PRODUCTION"});
    });
    expect(await applicationAccess(signed)).toBe("active");
    expect((await signed("https://example.org/application",{method:"GET"})).status).toBe(400);
    expect((await signed("/payments",{method:"POST"})).status).toBe(400);
    expect((await signed("/sessions", {method:"GET"})).status).toBe(400);
    expect((await signed("/application", {method:"DELETE"})).status).toBe(400);
    expect(paths).toEqual(["/application"]);
    expect(await applicationAccess(async()=>Response.json({active:false,services:["AIS"]}))).toBe("inactive");
    expect(await applicationAccess(async()=>Response.json({services:["AIS"]}))).toBe("unavailable");
  });
  it("reads booked movements across FX without treating pending rows or unstable IDs as bank evidence",async()=>{
    const cash={amount:"10.24",currency:"EUR"};
    const txn={status:"BOOK",credit_debit_indicator:"DBIT",booking_date:"2026-01-05",transaction_amount:cash,
      transaction_id:"unstable",exchange_rate:{instructed_amount:{amount:"12.00",currency:"USD"}},
      creditor:{name:"Fixture supplier"},creditor_account:{iban:"DE00000000000000000000"}};
    const adapter=createEnableBankingAdapter(app,pem,app,async(url,init)=>{
      expect(url.pathname).toBe(`/accounts/${app}/transactions`);
      expect(url.searchParams.get("transaction_status")).toBe("BOOK");
      expect(url.searchParams.get("date_to")).toBe(range.to);
      expect(init.method).toBe("GET");
      return Response.json({transactions:[txn,{...txn,status:"PDNG"}]});
    });
    const result=await adapter.readPage(range,null);
    expect(result.success).toBe(true);
    if(!result.success) return;
    expect(result.data.rows.length).toBe(1);
    expect(result.data.rows[0]?.transactionId).toBeUndefined();
    expect(result.data.rows[0]?.amount).toBe("-10.2400");
    expect(result.data.rows[0]?.nativeAmount).toBe("-12.0000");
    expect(result.data.rows[0]?.counterparty).toBe("Fixture supplier");
  });
});
