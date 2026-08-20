"use client";

/**
 * Carregado sob demanda pelo `MotionProvider` (LazyMotion com `features`
 * assincrono). Fica em modulo separado de proposito: assim o pacote de
 * features do Motion nao entra no First Load JS de nenhuma rota — ele vira
 * um chunk proprio, buscado depois do primeiro paint.
 *
 * Usamos `domMax` (e nao `domAnimation`) porque o app depende de layout
 * animations: `layoutId` faz o no da trilha virar o header da licao e o
 * "+XP" ser absorvido pelo contador do HUD.
 */
import { domMax } from "motion/react";

export default domMax;
