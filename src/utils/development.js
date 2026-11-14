const disabled = () => ({ allowed: false, channel: "unavailable" });
export async function resolveDevelopmentEnvironment({
  native,
  debugWeb = false,
  checkNative,
}) {
  if (!native)
    return debugWeb ? { allowed: true, channel: "web-local" } : disabled();
  try {
    const result = await checkNative();
    if (
      result?.allowed === true &&
      ["debug", "sandbox"].includes(result.channel)
    )
      return { allowed: true, channel: result.channel };
  } catch {
    /* Verification failures never enable internal tools. */
  }
  return disabled();
}
