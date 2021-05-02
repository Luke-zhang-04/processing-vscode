declare module "*.yml" {
    declare const content: {[key: string]: unknown}

    export default content
}
