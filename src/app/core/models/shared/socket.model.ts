import { Model } from "../api/model";

export class SocketModel extends Model{
  public type?: string;
  public process?: string;
  public operation?: string;
  public sender?: any;
  public recipient?: any;
  public content?: any;
  public timestamp?: string;

  constructor(data?: object){
    super(data);
    this.type = this.type || null;
    this.process = this.process || null;
    this.operation = this.operation || null;
    this.sender = this.sender || null;
    this.recipient = this.recipient || null;
    this.content = this.content || null;
    this.timestamp = this.timestamp || null;
  }

  public static cast(data: object): SocketModel{
    const obj = new SocketModel(data);
    return {
      type: obj.type,
      process: obj.process,
      operation: obj.operation,
      sender: obj.sender,
      recipient: obj.recipient,
      content: obj.content,
      timestamp: obj.content
    }
  }

  public static casts(dataArray: object[]): SocketModel[]{
    return dataArray.map((data) => new SocketModel(data));
  }
}