module.exports.Message = class Message {

    #content;
    #sender;
    #receiver;
    #date;
    read_status = 0;
    constructor(
        content,
        sender,
        receiver,
        date
    ){
        this.#content = content;
        this.#sender = sender;
        this.#receiver = receiver;
        this.#date = date.slice(0,10);
    }
    
    getMessageValues() {
        return [
            this.#content,
            this.#sender,
            this.#receiver,
            this.#date,
            this.read_status
        ]
    }
}