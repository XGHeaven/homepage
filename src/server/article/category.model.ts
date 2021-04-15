import { Field, ObjectType } from "@nestjs/graphql";
import { Article } from "./article.model";

@ObjectType()
export class Category {
  @Field()
  name!: string

  @Field(of => [Article])
  articles!: Article[]
}
