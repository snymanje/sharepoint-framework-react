import * as React from "react";
import styles from "./HelloWorld.module.scss";
import { IHelloWorldProps } from "./IHelloWorldProps";
import { escape } from "@microsoft/sp-lodash-subset";

import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import MockHttpClient from '../mock/MockHttpClient';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}

interface IHelloWorldState {
  data: ISPList[];
}

export default class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState> {

  public constructor(props: IHelloWorldProps) {
    super(props)

    this.state = {
     data: []
    }
  }

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get()
      .then((data: ISPList[]) => {
        var listData: ISPLists = { value: data };
        return listData;
      }) as Promise<ISPLists>;
  }

  private _getListData(): Promise<ISPLists> {
    return this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private async _renderListAsync(): Promise<ISPLists> {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      return this._getMockListData();
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
             Environment.type == EnvironmentType.ClassicSharePoint) {
      return this._getListData();
    }
  }

  public async componentDidMount(): Promise<void> {
    const data = await this._renderListAsync()
    console.log(data);
     this.setState({ data: data.value });
  }

  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>
                Welcome to SharePoint with reactjs!
              </span>
              <p className={styles.subTitle}>
                Customize SharePoint experiences using Web Parts.
              </p>
              <p className={styles.description}>
                {escape(this.props.description)}
              </p>
              <p className={styles.description}>
                {escape(this.props.test2)}
              </p>
              <p className={styles.description}>
                {escape(this.props.test)}
              </p>
              <p>{ this.props.context.pageContext.web.title }</p>
              <div>{ this.state.data.map(value => {
                return (
                  <div key={value.Id}>{ value.Title }</div>
                )
              })}</div>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
