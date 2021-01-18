import * as React from "react";
import styles from "./HelloWorld.module.scss";
import { IHelloWorldProps } from "./IHelloWorldProps";
import { escape } from "@microsoft/sp-lodash-subset";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ListGroup from "react-bootstrap/ListGroup"
import Table from "react-bootstrap/Table"

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
      <Container>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>WebPart Description Property</th>
              <th>Site Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{escape(this.props.description)}</td>
              <td>{escape(this.props.context.pageContext.web.title)} </td>
            </tr>
          </tbody>
        </Table>

        <ListGroup>
                { this.state.data.map(value => {
                return (
                  <ListGroup.Item key={value.Id} style={{ 'color': '#000' }}>{ value.Title }</ListGroup.Item>
                )
              })}                
              </ListGroup>
              <Button variant="primary">Primary</Button>
      </Row>

            <h1>MyBootstrap React</h1>
              <Row>
                <Col>1 of 2</Col>
                <Col>2 of 2</Col>
              </Row>
              <Row>
                <Col>1 of 3</Col>
                <Col>2 of 3</Col>
                <Col>3 of 3</Col>
              </Row>
              <Row>
                <ButtonToolbar>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="info">Info</Button>
                  <Button variant="light">Light</Button>
                  <Button variant="dark">Dark</Button>
                  <Button variant="link">Link</Button>
                </ButtonToolbar>
              </Row>
      </Container>
    );
  }
}
