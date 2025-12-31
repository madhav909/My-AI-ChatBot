<script lang="ts">
  let messages: { sender: "user" | "ai"; text: string }[] = [];
  let input = "";
  let sessionId: string | null = null;
  let loading = false;

  async function sendMessage() {
    if (!input.trim() || loading) return;

    messages = [...messages, { sender: "user", text: input }];
    loading = true;

    try {
      const res = await fetch("http://localhost:3001/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId })
      });

      const data = await res.json();
      sessionId = data.sessionId;

      messages = [...messages, { sender: "ai", text: data.reply }];
    } catch {
      messages = [...messages, { sender: "ai", text: "⚠️ Server error" }];
    }

    input = "";
    loading = false;
  }
</script>

<div class="chat">
  <h2>AI Support Chat</h2>

  <div class="messages">
    {#each messages as m}
      <div class={m.sender}>{m.text}</div>
    {/each}

    {#if loading}
      <div class="ai">Agent is typing…</div>
    {/if}
  </div>

  <div class="input">
    <input
      placeholder="Type a message..."
      bind:value={input}
      on:keydown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button on:click={sendMessage} disabled={loading}>
      Send
    </button>
  </div>
</div>

<style>
  .chat {
    max-width: 420px;
    margin: 40px auto;
    font-family: sans-serif;
  }

  .messages {
    border: 1px solid #ccc;
    padding: 10px;
    height: 300px;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  .user {
    text-align: right;
    color: #2563eb;
    margin: 6px 0;
  }

  .ai {
    text-align: left;
    color: #059669;
    margin: 6px 0;
  }

  .input {
    display: flex;
    gap: 6px;
  }

  input {
    flex: 1;
    padding: 6px;
  }
</style>
