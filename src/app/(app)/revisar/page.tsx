import type { Metadata } from "next";
import { RevisarClient } from "./revisar-client";

export const metadata: Metadata = {
  title: "Revisar erros",
  description:
    "Repesque as questões que você errou. Elas voltam até você dominá-las.",
};

export default function RevisarPage() {
  return <RevisarClient />;
}
