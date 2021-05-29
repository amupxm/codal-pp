import axios from "axios";
interface CodalObject {
  TracingNo: number;
  Symbol: string;
  CompanyName: string;
  UnderSupervision: 0;
  Title: string;
  LetterCode: string;
  SentDateTime: string;
  PublishDateTime: string;
  HasHtml: boolean;
  Url: string;
  HasExcel: boolean;
  HasPdf: boolean;
  HasXbrl: boolean;
  HasAttachment: boolean;
  AttachmentUrl: string;
  PdfUrl: string;
  ExcelUrl: string;
}

interface CodalResponse {
  Total: number;
  Page: number;
  Letters: CodalObject[];
}
class CodalInstance {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  async fetchData(): Promise<CodalResponse> {
    const url = this.getUrl(String(1), this.name);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    try {
      let r = await axios
        .get<CodalResponse>(encodeURI(url))
        .then((e) => e.data);
      return r;
    } catch (e) {
      console.log(e);
      throw new Error("commination error");
    }
  }

  private getUrl(page: string, stock_name: string): string {
    const url = `https://search.codal.ir/api/search/v2/q?&Audited=true&AuditorRef=-1&Category=-1&Childs=true&CompanyState=-1&CompanyType=-1&Consolidatable=true&IsNotAudited=false&Length=-1&LetterType=-1&Mains=true&NotAudited=true&NotConsolidatable=true&PageNumber=${page}&Publisher=false&Symbol=${stock_name}&TracingNo=-1&search=true`;
    return url;
  }
}

export default CodalInstance;
export { CodalInstance, CodalObject };
