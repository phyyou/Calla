export const event = (
  eventName: string,
  eventParams?:
    | Gtag.CustomParams
    | Gtag.ControlParams
    | Gtag.EventParams
    | undefined
) => {
  if (typeof window !== "undefined") {
    window.gtag("event", eventName, eventParams);
  }
};
