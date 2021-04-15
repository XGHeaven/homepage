import { Field, ObjectType } from "@nestjs/graphql";
import { Article } from "./article.model";

@ObjectType()
export class ArticleTag {
  @Field()
  name!: string

  @Field(type => [Article])
  articles!: Article[]
}
