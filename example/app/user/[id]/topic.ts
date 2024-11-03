

export const onSubscribe = (client: object, data: object, params: object ) => {
  console.log("subscribed! ");
  console.log(client)
  console.log(data)
  console.log(params)
};

export const onUnsubscribe = (client: object) => {
  console.log("unsubscribed");
};

export const onMessage = (client: object, message: string) => {};
