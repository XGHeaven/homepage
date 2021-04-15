import { Field, ObjectType, Scalar } from "@nestjs/graphql";
import JSONObject from 'graphql-type-json';
import { ArticleTag } from "./article-tag.model";
import { Category } from "./category.model";

@ObjectType()
export class Article {
  tagNames: string[] = []
  categoryName: string = ''

  @Field(type => Category)
  category!: Category

  @Field(type => [ArticleTag], {nullable: 'items'})
  tags!: (ArticleTag | null)[]

  @Field(type => String)
  title!: string

  @Field(type => String)
  slug!: string

  @Field()
  intro!: string

  @Field(type => JSONObject)
  frontmatter!: any

  @Field(type => JSONObject)
  nodes!: any

  @Field(type => JSONObject, { nullable: true })
  toc!: any

  @Field()
  date!: Date

  @Field({nullable: true})
  coverImage?: string
}
