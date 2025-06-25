//@ts-check

import {
  Body,
  BodyNode,
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
 */
export function createNotifyDialog(text) {
  const lb = new Label()
    ._Text(text)
    ._VerCenter()
    ._Stretch();
  const d = new DialogBody()
    ._Dim()
    ._Add(
      new Container()
        ._Panel()
        ._MaxSize(Percent(100), Percent(100))
        ._Size(Px(320), Px(280))
        ._FlexContainer()
        ._FlexDirection("column")
        ._Add(
          new Node()
            ._Size(Percent(100))
            ._FlexContainer()
            ._VerCenter()
            ._Add(
              lb,
            ),
          new Node()._Add(
            new Button()
              ._Width(Px(100))
              ._Text("ปิด")
              ._Stretch()
              ._OnClick(() => d.detach()),
          ),
        ),
    );
  Body._Add(d);
  return d;
}
