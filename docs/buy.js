/**
 * 購入ボタン（TouchRotator の buy.js と同じ作り）。
 *
 * 店の設定はこの先頭にまとめてある。価格 ID が空のあいだは購入ボタンを隠し、
 * 「まもなく販売を開始します」と出す。準備が途中のサイトに、押しても動かない
 * ボタンが出ることはない。
 */
// Paddle の client-side token。ページに載せて公開するもので、秘密ではない（TouchRotator と同じアカウント）。
const PADDLE_TOKEN = "live_caa95e53994f8145b0400f7618d";
// Profilink（980 円・買い切り）の価格 ID。Paddle で商品を作ったら入れる（pri_…）。
const PADDLE_PRICE = "pri_01m7mt5t0y8pj56pzxyx4wbz63";
const THANKS_URL = "https://profilink.tsubomi.jp/thanks.html";

const configured = PADDLE_TOKEN !== "" && PADDLE_PRICE !== "" && typeof Paddle !== "undefined";

if (configured) {
  Paddle.Initialize({
    token: PADDLE_TOKEN,
    // Paddle は購入完了後の URL に取引番号を付けないので、完了の知らせを受けてから
    // こちらで移動する（購入後のページは取引番号でキーを受け取る）。
    eventCallback(event) {
      if (event.name !== "checkout.completed") return;
      const transaction = event.data && event.data.transaction_id;
      if (!transaction) return;
      location.href = `${THANKS_URL}?_ptxn=${encodeURIComponent(transaction)}`;
    },
  });
}

document.querySelectorAll("[data-buy]").forEach((button) => {
  button.hidden = !configured;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    Paddle.Checkout.open({
      items: [{ priceId: PADDLE_PRICE, quantity: 1 }],
      settings: { locale: "ja" },
    });
  });
});

document.querySelectorAll("[data-not-yet]").forEach((note) => {
  note.hidden = configured;
});
