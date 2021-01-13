import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IHelloWorldProps {
  description: string;
  test: string;
  test1: boolean;
  test2: string;
  test3: boolean;
  context: WebPartContext;
}
