/**
 * Note class. Represents the notes that the users will store
 */
export class Note {
  /**
   * Constructor
   * @param title of the note 
   * @param body of the note 
   * @param colour of the note
   */
  constructor(private title: string, private body: string, 
    private colour: string) {}

  /**
   * @returns the title
   */
  public getTitle() {
    return this.title;
  }

  /**
   * @returns the colour
   */
  public getColour() {
    return this.colour;
  }

  /**
   * @returns the body
   */
  public getBody() {
    return this.body;
  }

  /**
   * Set's a new title
   * @param title new title to change
   */
  public setTitle(title: string) {
    this.title = title;
  }

  /**
   * Set's a new body
   * @param body new body to change
   */
  public setBody(body: string) {
    this.body = body;
  }

  /**
   * Set's a new colour
   * @param colour new colour to change
   */
  public setColour(colour: string) {
    this.colour = colour;
  }
}
