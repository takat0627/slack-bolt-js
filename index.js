"use strict";

// https://github.com/slackapi/bolt-js
// https://github.com/slackapi/bolt-js/blob/main/examples/socket-mode/app.js
// chatを使ってみる
import slack_bolt from "@slack/bolt";
const { App } = slack_bolt;
import { submitTask, showTask } from "./Task.js";

// トークン類
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

const app = new App({
  //   logLevel: 'debug',  // これはログレベルの調整なので削除しても OK です
  socketMode: true,
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
});

let global_channel = SLACK_CHANNEL;

// グローバルショートカット
app.shortcut("socket-mode-shortcut", async ({ ack, body, client }) => {
  await ack();
  await client.views.open({
    trigger_id: body.trigger_id,
    view: submitTask("taskModal"),
  });
});

// console.log(view.state.values['input-task'].input.value)
app.view("taskModal", async ({ ack, body, view, client }) => {
  // logger.info(`Submitted data: ${view.state.values}`)
  await ack();
  try {
    const taskName = view.state.values.taskName.enteredTaskName.value;
    const taskDetail = view.state.values.taskDetail.enteredTaskDetail.value;
    const taskDate = view.state.values.taskDate.date.selected_date;
    const taskOption = view.state.values.taskOption.enteredTaskOption.value;
    const fromUser = {
      id: body.user.id,
      name: body.user.name,
    };
    // publicであってもボットが登録されていないと送信できない
    await client.chat.postMessage({
      channel: global_channel,
      text: "accept task",
      blocks: showTask(taskName, taskDetail, taskDate, taskOption, fromUser),
    });
  } catch (error) {
    console.log(error);
  }
});

// イベント API -> message全てに反応する
app.message("hello", async ({ message, say }) => {
  await say(`:wave: *message* こんにちは <@${message.user}>！`);
});

// イベント API
// eventにメッセージ関連
// contextにbotの情報
// clientにはwebクライアントが入ってる
// app.event("app_mention", async ({ event, context, client, say }) => {
app.event("app_mention", async ({ event, say }) => {
  try {
    // メンションをコマンドのように扱う
    const text = event.text.replace(/\s/g, "").replace(/<.+?>/g, "");
    console.log(text);
    if (text) {
      await mention_action(text, event, say);
    } else {
      await say(
        `:wave: こんにちは <@${event.user}>！ \n :grin: 登録されているチャンネルは <${global_channel}> です！`
      );
    }
  } catch (error) {
    console.error(error);
  }
});

const mention_action = async (cmd, event, say) => {
  // switch内で変数宣言する場合，ESLint的にはコードブロックにしないと"no-case-declarations"で怒られる
  switch (cmd) {
    case "hello":
      await say(`:wave: こんにちは <@${event.user}>`);
      break;
    case "set_channel":
      global_channel = event.channel;
      await say(`:+1: 送信先チャンネルをUpdateしました <${event.channel}>！`);
      break;
    case "get_channel":
      await say(`:grin: 登録されているチャンネルは <${global_channel}> です！`);
      break;
    case "commands": {
      // TODO: コマンド一覧をmapか何かで作成．ここではそのfor文を実行してメッセージを作成．
      const message = `
              :muscle: 利用できるコマンドは以下の通りです\n
              1. hello : 挨拶\n
              2. set_channel : 呼び出し元のチャンネルの取得\n
              3. get_channel : 登録されているチャンネルの取得\n
              4. commands : 利用できるコマンド一覧\n
              `;
      await say(message);
      break;
    }
    default:
      await say(`:pray: 対応してません．`);
      break;
  }
};

(async () => {
  await app.start();
  console.log("⚡️ Bolt app started");
})();
