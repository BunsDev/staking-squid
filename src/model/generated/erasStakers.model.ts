import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class ErasStakers {
    constructor(props?: Partial<ErasStakers>) {
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

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    selfBonded!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalBonded!: bigint

    @Column_("int4", {nullable: true})
    nominatorCount!: number | undefined | null

    @Column_("int4", {nullable: true})
    commission!: number | undefined | null
}
