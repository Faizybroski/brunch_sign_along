
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleOrderConfirmation } from "./handler.ts";

serve(handleOrderConfirmation);
