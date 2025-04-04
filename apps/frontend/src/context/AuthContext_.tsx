import { AuthContextType } from "@repo/types";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
