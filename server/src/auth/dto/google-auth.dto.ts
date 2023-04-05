import { PartialType } from "@nestjs/mapped-types";
import { RegisterAuthDto } from "./register-auth.dto";

export class GoogleAuthDto extends PartialType(RegisterAuthDto) {
    googleUser: boolean
}
