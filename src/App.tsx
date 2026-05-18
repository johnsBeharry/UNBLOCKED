import { useState } from 'react';
import { motion } from 'motion/react';

const SCATTER_MATRIX = [
    { x: -10, y: -90, r: -3.5 },
    { x: 8,   y: -30,  r: 2.2 },
    { x: -5,  y: 30,   r: -1.5 },
    { x: 12,  y: 90,  r: 0.8 }
];

const CARDS = [
    {
        id: "sys-01",
        tag: "UNBLOCKED // SYSTEM 01",
        index: "01",
        title: "OWNERSHIP",
        desc: "Who controls the invisible architecture? An exploration into digital property, sovereignty, and the illusion of possession within artificial networks.",
        bg: "#f2ede4",
        text: "#1a1a1a"
    },
    {
        id: "sys-02",
        tag: "UNBLOCKED // SYSTEM 02",
        index: "02",
        title: "PERMANENCE",
        desc: "Data never dies, yet memory fades. Confronting the immutable digital footprints we leave behind, and how data outlives the biological self.",
        bg: "#1c2a22",
        text: "#eedec9"
    },
    {
        id: "sys-03",
        tag: "UNBLOCKED // SYSTEM 03",
        index: "03",
        title: "ENERGY",
        desc: "The physical cost of virtual thoughts. Tracking the raw power grids, cooling systems, and material toll powering our invisible computations.",
        bg: "#df5333",
        text: "#ffffff"
    },
    {
        id: "sys-04",
        tag: "UNBLOCKED // SYSTEM 04",
        index: "04",
        title: "PEERS",
        desc: "Consensus, crowds, and coordination. How hidden social dynamics and algorithmic behavior alter human participation without our conscious consent.",
        bg: "#0d1b2a",
        text: "#e0e1dd"
    }
];

function Card({ 
    card, 
    listIndex, 
    isFlying, 
    onClick 
}: { 
    card: typeof CARDS[0], 
    listIndex: number, 
    isFlying: boolean, 
    onClick: () => void 
}) {
    const targetConfig = SCATTER_MATRIX[listIndex];
    const depth = SCATTER_MATRIX.length - 1 - listIndex;

    const animateState = isFlying ? {
        y: -window.innerHeight * 0.8,
        x: -window.innerWidth * 0.1,
        rotateZ: targetConfig.r * 3,
        scale: 1.05,
    } : {
        y: targetConfig.y,
        x: targetConfig.x,
        rotateZ: targetConfig.r,
        scale: 1,
    };

    const transitionState = isFlying ? {
        duration: 0.4,
        ease: "easeOut"
    } : {
        type: "spring", 
        bounce: 0.25,
        duration: 0.6
    };

    const zIndex = listIndex + 10;

    return (
        <motion.div
            className="absolute w-[780px] h-[520px] rounded-[2px] pt-[32px] pb-[48px] px-[48px] shadow-[0_15px_35px_rgba(0,0,0,0.4)] cursor-pointer select-none overflow-hidden origin-center flex flex-col justify-between"
            style={{ 
                zIndex, 
                backgroundColor: card.bg, 
                color: card.text 
            }}
            animate={animateState}
            transition={transitionState}
            initial={false}
            onClick={onClick}
        >
            <div 
                className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none"
                style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
            />
            
            <motion.div 
                className="absolute inset-0 bg-black pointer-events-none"
                initial={false}
                animate={{ opacity: isFlying ? 0 : depth * 0.12 }}
                transition={{ duration: 0.5 }}
            />

            <div className="relative z-10 flex flex-col justify-start h-full">
                <div className="flex justify-between items-center border-b pb-3 mb-8" style={{ borderColor: card.text === '#1a1a1a' ? 'rgba(0,0,0,0.1)' : card.text === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}}>
                    <span className="text-[20px] font-bold uppercase tracking-[0.05em] opacity-90">
                        {card.title}
                    </span>
                    <span className="text-[20px] font-bold font-mono">
                        {card.index}
                    </span>
                </div>
                <div>
                    <p className={`max-w-xl text-[24px] leading-[1.5] ${card.id === 'sys-03' ? 'opacity-90' : 'opacity-80'}`}>
                        {card.desc}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function App() {
    const [stackOrder, setStackOrder] = useState(() => [...CARDS].reverse().map(c => c.id));
    const [flyingCard, setFlyingCard] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleCardClick = (cardId: string) => {
        if (isAnimating || stackOrder[stackOrder.length - 1] === cardId) return;
        
        setIsAnimating(true);
        setFlyingCard(cardId);
        
        setTimeout(() => {
            setStackOrder(prev => {
                const newOrder = prev.filter(id => id !== cardId);
                newOrder.push(cardId);
                return newOrder;
            });
            setFlyingCard(null);
            
            setTimeout(() => {
                setIsAnimating(false);
            }, 600); 
        }, 400); 
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-[#0b0b0b] overflow-hidden font-sans tracking-[-0.01em]">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] font-[900] text-[#1a1a1a] z-0 tracking-[-0.05em] select-none pointer-events-none">
                UNBLOCKED
            </div>

            <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-[1]">
                {CARDS.map((card) => (
                    <Card 
                        key={card.id} 
                        card={card} 
                        listIndex={stackOrder.indexOf(card.id)} 
                        isFlying={flyingCard === card.id}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}
            </div>

            <div className="fixed bottom-8 left-8 text-[#333] font-mono text-[10px] tracking-[0.2em] uppercase z-0 pointer-events-none">
                Tactile Interface System v2.0 // Hidden Archives
            </div>
            <div className="fixed bottom-8 right-8 text-[#333] font-mono text-[10px] tracking-[0.2em] uppercase z-0 pointer-events-none">
                Click to Unveil
            </div>
        </div>
    );
}
