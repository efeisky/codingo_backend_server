module.exports.Contact = class Contact {

    #email;
    #subject;
    #content;
    #date;
    status = 0;
    constructor(
        email,
        subject,
        content
    ){
        this.#email = email;
        this.#subject = subject;
        this.#content = content;
        this.#date = new Date().toISOString().slice(0,10);
        this.status = 1;
    }
    
    getContactValues() {
        return [
            this.#email,
            this.#subject,
            this.#content,
            this.#date,
            this.status
        ]
    }
}