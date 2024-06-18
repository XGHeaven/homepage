import * as React from "react";
import { LinkButton } from "../../blog/button";

export const Stage: React.FC<{
  title: string;
  index: number;
  moreLink?: string;
  children?: React.ReactNode;
}> = (props) => {
  const { moreLink } = props;
  return (
    <div
      className={`${
        props.index % 2 ? "bg-slate-300" : "bg-slate-200"
      } py-24 border-y border-slate-100`}
    >
      <div className="max-w-screen-lg mx-auto">
        <div className="text-5xl mb-12 text-gray-800 text-center">
          {props.title}
        </div>
        {props.children}
      </div>
      {moreLink && (
        <div className="text-center mt-4">
          <LinkButton to={moreLink} type="none">
            More
          </LinkButton>
        </div>
      )}
    </div>
  );
};
