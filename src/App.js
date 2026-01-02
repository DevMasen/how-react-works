import { useState } from 'react';

const content = [
	{
		summary: 'React is a library for building UIs',
		details:
			'Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	},
	{
		summary: 'State management is like giving state a home',
		details:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	},
	{
		summary: 'We can think of props as the component API',
		details:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
	},
];

export default function App() {
	return (
		<div>
			<Tabbed content={content} />
		</div>
	);
}

function Tabbed({ content }) {
	const [activeTab, setActiveTab] = useState(0);

	// Using key prop make the instances unic and save their state when component re-rendered and the the place in Virtual DOM changes.
	return (
		<div>
			<div className="tabs">
				<Tab num={0} activeTab={activeTab} onClick={setActiveTab} />
				<Tab num={1} activeTab={activeTab} onClick={setActiveTab} />
				<Tab num={2} activeTab={activeTab} onClick={setActiveTab} />
				<Tab num={3} activeTab={activeTab} onClick={setActiveTab} />
			</div>

			{/* Diffing 1st rule causes reset the TabContent state when a Different Content is places in The same position */}
			{activeTab <= 2 ? (
				// set unic key for component instance to make it different for react and reset on state update
				<TabContent item={content.at(activeTab)} key={activeTab} />
			) : (
				<DifferentContent />
			)}
		</div>
	);
}
// console.log(<DifferentContent />);
// console.log(DifferentContent());

function Tab({ num, activeTab, onClick }) {
	return (
		<button
			className={activeTab === num ? 'tab active' : 'tab'}
			onClick={() => onClick(num)}
		>
			Tab {num + 1}
		</button>
	);
}

function TabContent({ item }) {
	const [showDetails, setShowDetails] = useState(true);
	const [likes, setLikes] = useState(0);

	// this log shows render counts on state updates
	console.log('RENDER');

	function handleInc() {
		setLikes(likes + 1);
	}

	// render baching causes one render only for these three updates
	function handleTripleInc() {
		setLikes(curLikes => curLikes + 1);
		setLikes(curLikes => curLikes + 1);
		setLikes(curLikes => curLikes + 1);
	}

	function handleUndo() {
		setLikes(0);
		setShowDetails(true);

		// show the previous state because changes happens in commit phase
		console.log(likes, showDetails);
	}

	function handleUndoLater() {
		setTimeout(handleUndo, 2000);
	}
	return (
		<div className="tab-content">
			<h4>{item.summary}</h4>
			{showDetails && <p>{item.details}</p>}

			<div className="tab-actions">
				<button onClick={() => setShowDetails(h => !h)}>
					{showDetails ? 'Hide' : 'Show'} details
				</button>

				<div className="hearts-counter">
					<span>{likes} ❤️</span>
					<button onClick={handleInc}>+</button>
					<button onClick={handleTripleInc}>+++</button>
				</div>
			</div>

			<div className="tab-undo">
				<button onClick={handleUndo}>Undo</button>
				<button onClick={handleUndoLater}>Undo in 2s</button>
			</div>
		</div>
	);
}

function DifferentContent() {
	return (
		<div className="tab-content">
			<h4>I'm a DIFFERENT tab, so I reset state 💣💥</h4>
		</div>
	);
}

/*
Important facts:
SideEffects should not be used in Render Logic
Render Logic: that sort of codes that runs immediately after components usage.
SideEffects can be used in Event Handlers or some hooks like useEffect().

! React is a Library NOT a Framework
*/
