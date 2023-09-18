import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class EraNominations {
    constructor(props?: Partial<EraNominations>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    eraId!: number

    @Index_()
    @Column_("text", {nullable: false})
    validator!: string

    @Index_()
    @Column_("text", {nullable: false})
    nominator!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    vote!: bigint | undefined | null
}
