import styled from "@emotion/styled";
import React, { Fragment } from "react";
import { Outlet } from "react-router";
import { Aside } from "./aside";
import { useSource } from "../../react";
import { siteConfigSource } from "../../sources";
import { assetURL } from "./markdown-render";

const FixedSide = styled.div`
  position: fixed;
  width: 250px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Body = styled.div`
  width: 100%;
  padding-left: 250px;
  height: 100%;
  overflow: auto;
`;

const BodyInner = styled.div`
  min-height: 100vh;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  padding-top: 16px;
  display: inline-block;
`;

const Footer = styled.div`
  color: #9eabb3;
  font-size: 16px;
  text-align: center;
  margin-top: 75px;
  padding: 20px;
`;

const Copyright = styled.div``;

const Cover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: grey;
`;

export function BlogPage() {
  const [data, loading] = useSource(siteConfigSource, null);
  return (
    <Fragment>
      <FixedSide>
        <Aside />
      </FixedSide>
      <Body>
        <BodyInner>
          <Outlet />
          <Footer>
            <Copyright>
              Copyrights © 2024 XGHeaven. All Rights Reserved.
            </Copyright>
          </Footer>
        </BodyInner>
      </Body>
      <Cover
        style={
          data
            ? { backgroundImage: `url("${assetURL(data.backgroundImage!)}")` }
            : {}
        }
      />
    </Fragment>
  );
}
