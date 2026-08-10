// TODO: lucide-react-native doesn't have X (Twitter) brand icon, using Bird as placeholder
import { Bird as SiXIcon } from "lucide-react-native";
import { styled } from "nativewind";

import { type IconComponent } from "../../../web/lib/helper";

export const SiX: IconComponent = styled(SiXIcon, { className: "style" });
