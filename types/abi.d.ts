type ABISchema = {
  name: string;
  desc: string;
  methods: ABIMethodSchema[];
  events: ABIEventSchema[];
};

type ABIMethodSchema = {
  name: string;
  args: [
    {
      type: string;
      name?: string;
      desc?: string;
    }
  ];
  returns: {
    type: string;
    desc?: string;
  };
  readonly?: boolean;
};

type ABIEventSchema = {
  name: string;
  args: [
    {
      type: string;
      name?: string;
      desc?: string;
    }
  ];
};

export const abi: Record<string, ABISchema>;
