import {lookupArchive} from '@subsquid/archive-registry'
import {
    BatchContext,
    BatchProcessorCallItem,
    BatchProcessorEventItem,
    BatchProcessorItem,
    SubstrateBatchProcessor,
} from '@subsquid/substrate-processor'

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        // Lookup archive by the network name in the Subsquid registry
        //archive: lookupArchive("kusama", {release: "FireSquid"})

        chain: 'wss://rpc.polkadot.io',

        // Use archive created by archive/docker-compose.yml
        archive: lookupArchive('polkadot', {release: 'FireSquid'}),
    })
    // .setBlockRange(
    //     {from: 1},
    // )
    // .addEvent('Balances.Transfer', {
    //     data: {
    //         event: {
    //             args: true,
    //             extrinsic: {
    //                 hash: true,
    //                 fee: true,  
    //             },
    //         },
    //     },
    // } as const)
    .addEvent('Staking.Rewarded', {
        data: {
            event:{
                args: true,
                extrinsic:{
                    hash: true,
                }
            }
        }
    } as const)
    .addEvent('Staking.Slashed', {
        data:{
            event: {
                args: true,
                extrinsic:{
                    hash: true,
                }
            }
        }
    } as const)
    .addEvent('Staking.Bonded', {
        data:{
            event:{
                args:true,
                extrinsic:{
                    hash:true,
                    success:true
                }
            }
        }
    })
    .addEvent('Grandpa.NewAuthorities', {
        data: {
            event: {
                args: true,
            },
        },
    } as const)

export type Item = BatchProcessorItem<typeof processor>
export type EventItem = BatchProcessorEventItem<typeof processor>
export type CallItem = BatchProcessorCallItem<typeof processor>
export type ProcessorContext<Store> = BatchContext<Store, Item>
