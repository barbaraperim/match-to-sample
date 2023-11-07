import { PhaseType } from "./phase-type.enum";

export interface Phase {
    type: PhaseType;
    sampleCategory: number;
    optionsCategory: number;
}