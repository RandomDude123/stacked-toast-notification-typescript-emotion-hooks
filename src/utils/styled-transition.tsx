/* based on js version: https://gist.github.com/oncomouse/08b1920f6b42d90a01a0e296980386a4#file-styledtransition-js */

import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { CSSTransition } from "react-transition-group";

const has = (key: any, obj: any) =>
  Object.prototype.hasOwnProperty.call(obj, key);

const keyframes = [
  "appear",
  "enter",
  "exit",
  "appear-active",
  "enter-active",
  "exit-active",
  "appear-done",
  "enter-done",
  "exit-done"
];

const StyledTransition = styled(({ transitions, className, ...props }) => (
  <CSSTransition className={className} classNames={className} {...props} />
))`
  ${({ transitions }) =>
    keyframes
      .map((keyframe) => {
        const objectKey = keyframe.replace(/(-[a-z])/, (v) =>
          v.slice(1).toUpperCase()
        );
        if (has(objectKey, transitions)) {
          return css`
            &-${keyframe} {
              ${transitions[objectKey]}
            }
          `;
        }
        return null;
      })
      .filter((x) => x !== null)}
`;

export default StyledTransition;
