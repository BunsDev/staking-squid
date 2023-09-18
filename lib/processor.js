"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = void 0;
const archive_registry_1 = require("@subsquid/archive-registry");
const substrate_processor_1 = require("@subsquid/substrate-processor");
exports.processor = new substrate_processor_1.SubstrateBatchProcessor()
    .setDataSource({
    // Lookup archive by the network name in the Subsquid registry
    //archive: lookupArchive("kusama", {release: "FireSquid"})
    chain: 'wss://rpc.polkadot.io',
    // Use archive created by archive/docker-compose.yml
    archive: (0, archive_registry_1.lookupArchive)('polkadot', { release: 'FireSquid' }),
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
        event: {
            args: true,
            extrinsic: {
                hash: true,
            }
        }
    }
})
    .addEvent('Staking.Slashed', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
            }
        }
    }
})
    .addEvent('Staking.Bonded', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                success: true
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
});
//# sourceMappingURL=processor.js.map