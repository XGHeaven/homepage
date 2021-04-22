import { Field, ObjectType } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";

@ObjectType()
export class Site {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  name?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  backgroundImage?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  avatar?: string;
}
