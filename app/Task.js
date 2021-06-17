"use strict";

import { jsxslack } from "jsx-slack";
import { getNowYMD } from "./utils.js";
// TODO: import slackifyMarkdown from 'slackify-markdown';

export const submitTask = (callbackId) => jsxslack`
  <Modal
    title="タスク登録"
    submit="送信"
    close="キャンセル"
    callbackId=${callbackId}
  >
    <Input
      blockId="taskName"
      name="enteredTaskName"
      label="タスク名"
      placeholder="タスク名を入力してください" 
      required
    />
    <Textarea 
      blockId="taskDetail"
      name="enteredTaskDetail"
      label="タスク詳細"
      placeholder="タスクの詳細・期限などを書いてください" 
      maxLength={500}
      required
    />
    <Input
      blockId="taskOption"
      name="enteredTaskOption"
      label="その他"
    />
    
    <Section blockId="taskDate">
      <b>タスク期限</b>
      <DatePicker name="date" initialDate=${new Date()} />
    </Section>

  </Modal>
`;

// TODO: 期限時間の設定と改行処理をどうにかしてできるようにする（マークダウンにする処理は一旦なし）
export const showTask = (taskName, taskDetail, taskDate, taskOption, fromUser) => jsxslack`
  <Blocks>
    <Section>
      <p>タスクを受け付けました！ at ${getNowYMD(true)}</p>
    </Section>
    <Divider />

    <Section>
      <p>*依頼主* &emsp;&emsp;&emsp;&emsp; : &emsp; ${fromUser.name} (<a href="@${fromUser.id}" />)</p>
      <p>*タスク名* &emsp;&emsp;&ensp; : &emsp; ${taskName}</p>
      <p>*期限* &emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; : &emsp; ${taskDate}（18:00）</p>
      <p>*タスク詳細*</p>
      ${taskDetail}
      ${taskOption ? jsxslack`<p>*その他* &emsp;&emsp;&emsp;&emsp; : &emsp; ${taskOption}</p>` : ""}
    </Section>
    <Divider />
  </Blocks> 
`;
// slackifyMarkdown
