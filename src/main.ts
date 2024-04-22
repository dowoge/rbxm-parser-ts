/**
 * @author https://github.com/fiveman1
 * @file main.ts
 * Main function for testing purposes.
 */

import fs from "fs";
import { DataType, CoreInstance } from "./lib/roblox_types";
import { RobloxModel } from "./lib/roblox_model";

function depthFirstPrint(instance: CoreInstance, level: number)
{
    let s = "";
    for (let i = 0; i < level - 1; ++i)
    {
        s += "   ";
    }
    if (level > 0)
    {
        s += "└──";
    }
    s += `${instance.toString()}\n`;
    for (const child of instance.children)
    {
        s += depthFirstPrint(child, level + 1);
    }
    return s;
}

async function main()
{
    //const name = "test";
    //const model = RobloxModel.fromBuffer(fs.readFileSync(`input_files/${name}.rbxm`));
    //const model = RobloxModel.fromBuffer(fs.readFileSync(`input_files/${name}.rbxl`));

    //const assetId = 5258147910; // Map making starter kit
    //const assetId = 5227232138; // Numismatic
    const assetId = 17195837905; // my test model

    //const assetId = 4249137687; // Arcane
    const model = await RobloxModel.fromAssetId(assetId);

    if (!model)
    {
        console.log("Invalid model");
        return;
    }

    const root = model.roots[0];
    const firstPart = root.findFirstDescendantOfClass("Part");
    if (firstPart)
    {
        const size = firstPart.getProp("size", DataType.Vector3);
        if (size)
        {
            console.log(`First part's size: ${size}`);
            size.x = 33333;
            console.log(`First part's size: ${firstPart.getProp("size", DataType.Vector3)}`);
            size.y += 2;
            size.z *= 0.3;
            firstPart.setProp("size", DataType.Vector3, size);
            console.log(`First part's new size: ${firstPart.getProp("size", DataType.Vector3)}`);
        }

        console.log(`First part can collide: ${firstPart.canCollide}`);
        firstPart.canCollide = false;
        console.log(`First part can collide: ${firstPart.canCollide}`);
    }

    const mapStringValues = root.findChildren((child) => child.isA("StringValue") && (child.name === "DisplayName" || child.name === "Creator"));
    console.log("\n" + mapStringValues.join("\n"));
    
    let str = "";
    for (const root of model.roots)
    {
        str += depthFirstPrint(root, 0);
    }

    const name = assetId;
    fs.writeFileSync(`output_files/${name}.txt`, str);
}

main();