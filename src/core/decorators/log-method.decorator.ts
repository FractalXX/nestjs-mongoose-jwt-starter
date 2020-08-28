import { Logger } from "@nestjs/common";

export enum LogLevel {
  LOG = 'log',
  DEBUG = 'debug',
  WARN = 'warn',
  VERBOSE = 'verbose',
  ERROR = 'error',
}

export const Log = (level: LogLevel = LogLevel.DEBUG) => (target, methodName, descriptor) => {
  const className = target.constructor.name;
  const original = descriptor.value;

  descriptor.value = new Proxy(original, {
    apply: function (target, thisArg, args) {
      Logger[level](
        `>> ${methodName}(${JSON.stringify(args)})`,
        className,
      );

      const result = target.apply(thisArg, args);

      Logger[level](
        `<< ${methodName}(${JSON.stringify(args)})\nReturned: ${JSON.stringify(result)}`,
        className,
      );
      return result;
    },
  });
};