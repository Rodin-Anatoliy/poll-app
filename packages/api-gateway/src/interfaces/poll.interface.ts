export interface IAnswer {
  userName: string;
  selectedOption: number;
}
export interface IPoll {
  question: string;
  answerOptions: string[];
  answers?: IAnswer[];
}
