import * as z from "zod";
import { GranularityKey } from "../enum/granularity-key.enum";

export const GranularityKeySchema = z.enum(GranularityKey);
