"use client";

import {
  CorvinaConnect,
  CorvinaConnectEventType,
} from "@corvina/corvina-app-connect";
import { useSearchParams } from "next-vibe-ui/hooks/use-navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from "react";

interface CorvinaState {
  isCorvinaApp: boolean;
  jwt: string | null;
  organizationId: string | null;
  corvinaHost: string | null;
  connection: CorvinaConnect | null;
}

const CorvinaContext = createContext<CorvinaState>({
  isCorvinaApp: false,
  jwt: null,
  organizationId: null,
  corvinaHost: null,
  connection: null,
});

export function useCorvina(): CorvinaState {
  return useContext(CorvinaContext);
}

export function CorvinaProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const searchParams = useSearchParams();
  const connectionRef = useRef<CorvinaConnect | null>(null);
  const [state, setState] = useState<CorvinaState>({
    isCorvinaApp: false,
    jwt: null,
    organizationId: null,
    corvinaHost: null,
    connection: null,
  });

  useEffect(() => {
    const rawCorvinaHost = searchParams?.get("corvinaHost");
    if (!rawCorvinaHost) {
      return;
    }

    const corvinaHost = decodeURIComponent(rawCorvinaHost);

    CorvinaConnect.create({
      corvinaHost,
      currentWindow: window,
      corvinaHostWindow: window.parent,
    })
      .then((conn) => {
        connectionRef.current = conn;

        setState({
          isCorvinaApp: true,
          jwt: conn.jwt,
          organizationId: conn.organizationId,
          corvinaHost: conn.corvinaHost,
          connection: conn,
        });

        conn.on(CorvinaConnectEventType.JWT_CHANGED, (jwt: string) => {
          setState((prev) => ({ ...prev, jwt }));
        });

        conn.on(
          CorvinaConnectEventType.ORGANIZATION_ID_CHANGED,
          (organizationId: string) => {
            setState((prev) => ({ ...prev, organizationId }));
          },
        );

        return conn;
      })
      .catch(() => {
        // Not running inside Corvina or timed out - silent fallback
      });

    return (): void => {
      connectionRef.current?.dispose();
      connectionRef.current = null;
    };
  }, [searchParams]);

  return (
    <CorvinaContext.Provider value={state}>{children}</CorvinaContext.Provider>
  );
}
