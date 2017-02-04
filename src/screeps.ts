/* typescript definitions for screeps.com
 * http://support.screeps.com/hc/en-us/articles/203084991-API-Reference
 * */

type StatusCode = number;
declare var OK                  : StatusCode;
declare var ERR_NOT_OWNER       : StatusCode;
declare var ERR_NO_PATH         : StatusCode;
declare var ERR_NAME_EXISTS     : StatusCode;
declare var ERR_BUSY            : StatusCode;
declare var ERR_NOT_FOUND       : StatusCode;
declare var ERR_NOT_ENOUGH_ENERGY       : StatusCode;
declare var ERR_NOT_ENOUGH_RESOURCES    : StatusCode;
declare var ERR_INVALID_TARGET          : StatusCode;
declare var ERR_FULL            : StatusCode;
declare var ERR_NOT_IN_RANGE    : StatusCode;
declare var ERR_INVALID_ARGS    : StatusCode;
declare var ERR_TIRED           : StatusCode;
declare var ERR_NO_BODYPART     : StatusCode;
declare var ERR_NOT_ENOUGH_EXTENSIONS   : StatusCode;
declare var ERR_RCL_NOT_ENOUGH  : StatusCode;
declare var ERR_GCL_NOT_ENOUGH  : StatusCode;

enum Color {
    COLOR_RED   = 0,
    COLOR_PURPLE,
    COLOR_BLUE,
    COLOR_CYAN,
    COLOR_GREEN,
    COLOR_YELLOW,
    COLOR_ORANGE,
    COLOR_BROWN,
    COLOR_GREY,
    COLOR_WHITE
};

type FindOp = number;
declare var FIND_EXIT_TOP:                   FindOp;
declare var FIND_EXIT_RIGHT:                 FindOp;
declare var FIND_EXIT_BOTTOM:                FindOp;
declare var FIND_EXIT_LEFT:                  FindOp;
declare var FIND_EXIT:                       FindOp;
declare var FIND_CREEPS:                     FindOp;
declare var FIND_MY_CREEPS:                  FindOp;
declare var FIND_HOSTILE_CREEPS:             FindOp;
declare var FIND_SOURCES_ACTIVE:             FindOp;
declare var FIND_SOURCES:                    FindOp;
declare var FIND_DROPPED_ENERGY:             FindOp;
declare var FIND_DROPPED_RESOURCES:          FindOp;
declare var FIND_STRUCTURES:                 FindOp;
declare var FIND_MY_STRUCTURES:              FindOp;
declare var FIND_HOSTILE_STRUCTURES:         FindOp;
declare var FIND_FLAGS:                      FindOp;
declare var FIND_CONSTRUCTION_SITES:         FindOp;
declare var FIND_MY_SPAWNS:                  FindOp;
declare var FIND_HOSTILE_SPAWNS:             FindOp;
declare var FIND_MY_CONSTRUCTION_SITES:      FindOp;
declare var FIND_HOSTILE_CONSTRUCTION_SITES: FindOp;
declare var FIND_MINERALS:                   FindOp;
declare var FIND_NUKES:                      FindOp;

type BodyPart = string;
declare var WORK:           BodyPart;
declare var MOVE:           BodyPart;
declare var CARRY:          BodyPart;
declare var ATTACK:         BodyPart;
declare var RANGED_ATTACK:  BodyPart;
declare var HEAL:           BodyPart;
declare var CLAIM:          BodyPart;
declare var TOUGH:          BodyPart;

type StructureType = string;
declare var STRUCTURE_SPAWN :	    StructureType;
declare var STRUCTURE_EXTENSION:	StructureType;
declare var STRUCTURE_ROAD:	        StructureType;
declare var STRUCTURE_WALL:	        StructureType;
declare var STRUCTURE_RAMPART:	    StructureType;
declare var STRUCTURE_KEEPER_LAIR:	StructureType;
declare var STRUCTURE_PORTAL:	    StructureType;
declare var STRUCTURE_CONTROLLER:	StructureType;
declare var STRUCTURE_LINK:	        StructureType;
declare var STRUCTURE_STORAGE:	    StructureType;
declare var STRUCTURE_TOWER:	    StructureType;
declare var STRUCTURE_OBSERVER:	    StructureType;
declare var STRUCTURE_POWER_BANK:	StructureType;
declare var STRUCTURE_POWER_SPAWN:	StructureType;
declare var STRUCTURE_EXTRACTOR:	StructureType;
declare var STRUCTURE_LAB:	        StructureType;
declare var STRUCTURE_TERMINAL:	    StructureType;
declare var STRUCTURE_CONTAINER:	StructureType;
declare var STRUCTURE_NUKER:	    StructureType;

type ResourceType = string;
declare var RESOURCE_ENERGY:		        ResourceType;
declare var RESOURCE_POWER:		            ResourceType;
declare var RESOURCE_HYDROGEN:		        ResourceType;
declare var RESOURCE_OXYGEN:		        ResourceType;
declare var RESOURCE_UTRIUM:		        ResourceType;
declare var RESOURCE_LEMERGIUM:		        ResourceType;
declare var RESOURCE_KEANIUM:		        ResourceType;
declare var RESOURCE_ZYNTHIUM:		        ResourceType;
declare var RESOURCE_CATALYST:		        ResourceType;
declare var RESOURCE_GHODIUM:		        ResourceType;
declare var RESOURCE_HYDROXIDE:		        ResourceType;
declare var RESOURCE_ZYNTHIUM_KEANITE:		ResourceType;
declare var RESOURCE_UTRIUM_LEMERGITE:		ResourceType;
declare var RESOURCE_UTRIUM_HYDRIDE:		ResourceType;
declare var RESOURCE_UTRIUM_OXIDE:		    ResourceType;
declare var RESOURCE_KEANIUM_HYDRIDE:		ResourceType;
declare var RESOURCE_KEANIUM_OXIDE:		    ResourceType;
declare var RESOURCE_LEMERGIUM_HYDRIDE:		ResourceType;
declare var RESOURCE_LEMERGIUM_OXIDE:		ResourceType;
declare var RESOURCE_ZYNTHIUM_HYDRIDE:		ResourceType;
declare var RESOURCE_ZYNTHIUM_OXIDE:		ResourceType;
declare var RESOURCE_GHODIUM_HYDRIDE:		ResourceType;
declare var RESOURCE_GHODIUM_OXIDE:		    ResourceType;
declare var RESOURCE_UTRIUM_ACID:		    ResourceType;
declare var RESOURCE_UTRIUM_ALKALIDE:		ResourceType;
declare var RESOURCE_KEANIUM_ACID:		    ResourceType;
declare var RESOURCE_KEANIUM_ALKALIDE:		ResourceType;
declare var RESOURCE_LEMERGIUM_ACID:		ResourceType;
declare var RESOURCE_LEMERGIUM_ALKALIDE:	ResourceType;
declare var RESOURCE_ZYNTHIUM_ACID:		    ResourceType;
declare var RESOURCE_ZYNTHIUM_ALKALIDE:		ResourceType;
declare var RESOURCE_GHODIUM_ACID:		    ResourceType;
declare var RESOURCE_GHODIUM_ALKALIDE:		ResourceType;
declare var RESOURCE_CATALYZED_UTRIUM_ACID:		    ResourceType;
declare var RESOURCE_CATALYZED_UTRIUM_ALKALIDE:		ResourceType;
declare var RESOURCE_CATALYZED_KEANIUM_ACID:		ResourceType;
declare var RESOURCE_CATALYZED_KEANIUM_ALKALIDE:	ResourceType;
declare var RESOURCE_CATALYZED_LEMERGIUM_ACID:		ResourceType;
declare var RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:	ResourceType;
declare var RESOURCE_CATALYZED_ZYNTHIUM_ACID:		ResourceType;
declare var RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:	ResourceType;
declare var RESOURCE_CATALYZED_GHODIUM_ACID:		ResourceType;
declare var RESOURCE_CATALYZED_GHODIUM_ALKALIDE:	ResourceType;

interface FilterOpts{
    filter: any;
}

interface Owner {
    username: string;
}

interface RoomPosition {
    roomName:   string;
    x:          number;
    y:          number;

    findClosestByRange(typeOrObjects : FindOp | [RoomPosition], opts?: FilterOpts): RoomObject;
}

type Path = string;

interface RoomObject {
    pos:  RoomPosition,
    room: Room
}

interface Source extends RoomObject {
    energy: number;
    energyCapacity:number;
    id: string;
    ticksToRegeneration: number;
}

interface Mineral extends RoomObject {
    density: number;
    mineralAmount: number;
    mineralType: string;
    id: string;
    ticksToRegeneration: number;
}


interface Resource extends RoomObject {
    amount: number;
    id:     string;
    resourceType:   ResourceType;
}

interface ConstructionSite extends RoomObject {
    id:             string;
    my:             boolean;
    owner:          Owner;
    progress:       number;
    progressTotal:  number;
    structureType:  StructureType;
}

interface Flag extends RoomObject {
}

interface Structure extends RoomObject {
    hits:           number;
    hitsMax:        number;
    id:             string;
    structureType:  StructureType;

    destroy():  StatusCode;
    isActive(): boolean;
    notifyWhenAttacked(enabled: boolean): StatusCode;
}

interface OwnedStructure extends Structure {
    my: boolean;
}

interface StructureStorage extends OwnedStructure {
}
interface StructureTerminal extends OwnedStructure {
}



interface StructureController extends OwnedStructure {
    level:              number;
    progress:           number;
    progressTotal:      number;
    reservation:        any;
    safeMode:           number;
    safeModeAvailable:  number;
    safeModeCooldown:   number;
    sign:               any;
    ticksToDowngrade:   number;
    upgradeBlocked:     number;


    activateSafeMode(): StatusCode;
    unclaim():          StatusCode;
}

interface StructureSpawn extends OwnedStructure {
    energy:         number;
    energyCapacity: number;
    memory:         any;
    name:           string;
    spawning:       any;

    canCreateCreep (body : [BodyPart], name: string) : StatusCode;
    createCreep    (body : [BodyPart], name: string, memory: any) : string|StatusCode;
}

interface StructureExtension extends OwnedStructure{
    energy:         number;
    energyCapacity: number;
}

interface StructureTower extends OwnedStructure {
    energy:             number;
    energyCapacity:     number;

    attack(target : Creep):     StatusCode;
    heal(target:  Creep):       StatusCode;
    repair(target: Structure):  StatusCode;
    transferEnergy(target : Creep, amount? : number) : StatusCode;
}

interface Room {
    controller:                 StructureController;
    energyAvailable:            number;
    energyCapacityAvailable:    number;
    memory:                     any;
    mode:                       string;
    name:                       string;
    storage:                    StructureStorage;
    terminal:                   StructureTerminal;

    serializePath(path : [any]): string;
    deserializePath(path: string): any;

    createConstructionSite(x: number, y: number, structureType: StructureType) : StatusCode;
    createConstructionSite(pos: RoomPosition,    structureType: StructureType) : StatusCode;

    createFlag(x : number, y : number, name? : string, color?: Color, secondaryColor? : Color) : StatusCode;
    createFlag(pos: RoomPosition, name? : string, color?: Color, secondaryColor? : Color) : StatusCode;

    find(type: FindOp, opts? : FilterOpts) : [RoomObject];
};


interface Carry {
    energy: number;
    power:  number;
    H:      number;
    O:      number;
    U:	number;
    L:	number;
    K:	number;
    Z:	number;
    X:	number;
    G:	number;
    OH:	number;
    ZK:	number;
    UL:	number;
    UH:	number;
    UO:	number;
    KH:	number;
    KO:	number;
    LH:	number;
    LO:	number;
    ZH:	number;
    ZO:	number;
    GH:	number;
    GO:	number;
    UH2O:	number;
    UHO2:	number;
    KH2O:	number;
    KHO2:	number;
    LH2O:	number;
    LHO2:	number;
    ZH2O:	number;
    ZHO2:	number;
    GH2O:	number;
    GHO2:	number;
    XUH2O:	number;
    XUHO2:	number;
    XKH2O:	number;
    XKHO2:	number;
    XLH2O:	number;
    XLHO2:	number;
    XZH2O:	number;
    XZHO2:	number;
    XGH2O:	number;
    XGHO2:	number;
}

interface Creep extends RoomObject {
    body:           {type:string,hits:number,boost:string|undefined};
    carry:          Carry;
    carryCapacity:  number;
    fatigue:        number;
    hits:           number;
    hitsMax:        number;
    id:             string;
    memory:         any;
    my:             boolean;
    name:           string;
    owner:          Owner;
    saying:         string;
    spawning:       boolean;
    ticksToLive:    number;


    attack(target: Creep | Structure):              StatusCode;
    attackController(target : StructureController): StatusCode;
    build(target : ConstructionSite):               StatusCode;
    cancelOrder(methodName: string):                StatusCode;
    claimController(target : StructureController):  StatusCode;
    dismantle(target : Structure):                  StatusCode;
    drop(resourceType : ResourceType, amount? : number):    StatusCode;
    generateSafeMode(controller: StructureController):      StatusCode;
    getActiveBodyparts(part: BodyPart):             number;
    harvest(target: Source | Mineral ):             StatusCode;
    moveByPath(path: Path):                         StatusCode;
    moveTo(x: number, y : number, opts?: {reusePath:number, serializeMemory: boolean, noPathFinding: boolean}): StatusCode;
    moveTo(target: any, opts?: {reusePath:number, serializeMemory: boolean, noPathFinding: boolean}): StatusCode;
    notifyWhenAttacked(enabled : boolean):          StatusCode;
    pickup(target: Resource):                       StatusCode;
    rangedAttack(target: Creep | Structure):        StatusCode;
    rangedHeal(target: Creep):                      StatusCode;
    rangedMassAttack():                             StatusCode;
    repair(target: Structure):                      StatusCode;
    reserveController(target: StructureController): StatusCode;
    say(message: string, pub?: boolean):            StatusCode;
    signController(target: StructureController, text: string): StatusCode;
    suicide():                                      StatusCode;
    transfer(target: Creep | Structure, resourceType: ResourceType, amount?: number): StatusCode;
    upgradeController(target: StructureController): StatusCode;
    withdraw(target: Structure, resourceType: ResourceType, amount?: number): StatusCode;
}

interface Game {
    //constructionSites : {[key:string]: ConstructionSite}
    creeps: { [key: string] : Creep };
    //flags:  { [key: string] : Flag};
    gcl: {
        level:          number,
        progress:       number,
        progressTotal:  number
    };
    //map: Map;
    //market: Market;
    resources: any;
    rooms:  {[key:string]: Room};
    spawns: {[key:string]: StructureSpawn};
    structures: {[key:string]: Structure};
    time: number;

    cpu: {
        limit:      number;
        tickLimit:  number;
        bucket:     number;
        getUsed():  number;
    }
    getObjectById(id: string): any;
    notify(message: string, groupInterval?: number): undefined;
};

declare var Game:   Game;
declare var Memory: any;
type Element = null;

