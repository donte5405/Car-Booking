//@ts-check

import {
  Body,
  Button,
  Container,
  DialogBody,
  Label,
  Node,
  Percent,
  Px,
} from "../dandelion/dandelion.js";

/**
 * Spawn a dialog.
 * @param {string} text
 * @param {function} func
 */
export function createNotifyDialog(text, func = null) {
  const lb = new Label()
    .Text(text)
    .VerCenter()
    .Stretch();
  const d = new DialogBody()
    .Dim()
    .Add(
      new Container()
        .Panel()
        .MaxSize(Percent(100), Percent(100))
        .Size(Px(320), Px(280))
        .FlexContainer()
        .FlexDirection("column")
        .Add(
          new Node()
            .Size(Percent(100))
            .FlexContainer()
            .VerCenter()
            .Add(
              lb,
            ),
          new Node().Add(
            new Button()
              .Width(Px(100))
              .Text("ปิด")
              .Stretch()
              .OnClick(() => {
                d.detach();
                if (func) {
                  func();
                }
              }),
          ),
        ),
    );
  Body.Add(d);
  return d;
}
