/**
 * Copyright © 2015 John Watson
 * Licensed under the terms of the MIT License
 * ---
 * LootTable is used to make a random choice among a weighted list of alternatives
 * for item drops, map generation, and many other processes. Here's a good overview
 * of loot tables: http://www.lostgarden.com/2014/12/loot-drop-tables.html
 *
 * Example:
 *
 * const lt = new LootTable.create()
 * LootTable.add(lt, 'sword', 20)
 * LootTable.add(lt, 'shield', 5)
 * LootTable.add(lt, 'gold', 5)
 * LootTable.add(lt, null, 1)
 * const item = LootTable.choose(lt) // most likely a sword, sometimes null
 */
export function create () {
    return [ ]
}


export function clear (table) {
    table.length = 0
}


/**
 * Add an item
 *
 * Weights are arbitrary, not percentages, and don't need to add up to 100.
 * If one item has a weight of 2 and another has a weight of 1, the first item
 * is twice as likely to be chosen. If quantity is given, then calls to choose()
 * will only return that item while some are available. Each choose() that
 * selects that item will reduce its quantity by 1.
 *
 * Item can be anything, not just strings. It could be an array, a number, JSON
 * data, null, a function... even another LootTable!
 * 
 * @param {mixed} item      The item to be chosen
 * @param {number} weight   (optional) The weight of the item, defaults to 1
 * @param {number} quantity (optional) Quantity available, defaults to Infinite
 */
export function add (table, item, weight, quantity) {
    if (weight === undefined || weight === null || weight <= 0)
        weight = 1

    if (!Number.isInteger(quantity) || quantity <= 0)
        quantity = Number.POSITIVE_INFINITY

    table.push({ item, weight, quantity })
}


/**
 * Return a random item from the LootTable
 */
export function choose (table) {
    if (table.length === 0)
        return null
    
    let totalWeight = 0
    for (const v of table)
        if (v.quantity > 0)
            totalWeight += v.weight

    let choice = 0
    const randomNumber = Math.floor(Math.random() * totalWeight + 1)
    let weight = 0

    for (let i = 0; i < table.length; i++) {
        const v = table[i]
        if (v.quantity <= 0)
            continue

        weight += v.weight
        if (randomNumber <= weight) {
            choice = i
            break
        }
    }

    const chosenItem = table[choice]
    table[choice].quantity--

    return chosenItem.item
}

