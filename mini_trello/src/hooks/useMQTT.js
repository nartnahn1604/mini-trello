import { useContext } from "react";
import MQTTProviderContext from "../context/MQTTProvider";

export default function useMQTT() {
  return useContext(MQTTProviderContext);
}
