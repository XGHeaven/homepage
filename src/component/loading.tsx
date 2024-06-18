import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { FC, useEffect, useState } from "react";

const LoadingWrapper = styled.div`
  width: 100%;
  padding: 32px 0;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const lightAnimation = keyframes`
from {
  opacity: .2;
}

15% {
  opacity: .7;
}

30% {
  opacity: .2;
}

to {
  opacity: .2;
}
`;

const LoadingText = styled.div`
  display: inline-block;
  padding: 0 12px;
  animation-name: ${lightAnimation};
  animation-iteration-count: infinite;
  opacity: 0.2;
  font-size: 24px;
  font-weight: bold;
`;

const ErrorContent = styled.div`
  font-size: 24px;
`;

const texts = "XGHEAVEN".split("");

export const Loading: FC<{
  loading?: boolean;
  error?: any;
  totalTime?: number;
  enterTime?: number;
}> = (props) => {
  const { totalTime = 3000, enterTime = 200 } = props;
  const count = texts.length;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setShow(true);
    }, enterTime);
    return () => clearInterval(id);
  }, []);

  return props.loading ? (
    <LoadingWrapper style={show ? { opacity: 1 } : { opacity: 0 }}>
      {texts.map((text, i) => (
        <LoadingText
          key={text + i}
          style={{
            animationDuration: `${totalTime}ms`,
            animationDelay: `${(totalTime / count) * i}ms`,
          }}
        >
          {text}
        </LoadingText>
      ))}
    </LoadingWrapper>
  ) : props.error ? (
    <LoadingWrapper style={{ opacity: 1 }}>
      <ErrorContent>{props.error?.message}</ErrorContent>
    </LoadingWrapper>
  ) : (
    (props.children as any)
  );
};
