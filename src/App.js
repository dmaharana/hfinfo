import { useEffect, useState } from "react";
import supabase from "./supbase";
import CategoryFilter from "./components/CategoryFilter";
import Header from "./components/Header";
import "./style.css";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votes_interesting: 24,
    votes_mindblowing: 9,
    votes_false: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votes_interesting: 11,
    votes_mindblowing: 2,
    votes_false: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votes_interesting: 8,
    votes_mindblowing: 3,
    votes_false: 1,
    createdIn: 2015,
  },
];
function App() {
  const [showForm, setShowForm] = useState(false);
  const [factList, setFactList] = useState(initialFacts);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");
        if (currentCategory !== "all") {
          query = query.eq("category", currentCategory);
        }

        const { data: facts, error } = await query
          .order("votes_interesting", { ascending: false })
          .limit(1000);

        console.log("facts", facts, "error", error);

        if (!error && facts) {
          setFactList(facts);
          setIsLoading(false);
        } else {
          console.log(error);
        }
      }

      getFacts();
    },
    [currentCategory]
  );

  return (
    <div>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm && (
        <NewFactForm setFactList={setFactList} setShowForm={setShowForm} />
      )}
      <main className="main">
        <CategoryFilter
          catagories={CATEGORIES}
          setCurrentCategory={setCurrentCategory}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList
            catagories={CATEGORIES}
            factList={factList}
            setFactList={setFactList}
          />
        )}
      </main>
    </div>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function FactList({ catagories, factList, setFactList }) {
  if (factList.length === 0)
    return (
      <p className="message">
        There are no facts in this category yet! Create a new fact.
      </p>
    );

  return (
    <section>
      <ul className="facts-list">
        {factList.map((fact) => (
          <Fact
            key={fact.id}
            fact={fact}
            catagories={catagories}
            setFacts={setFactList}
          />
        ))}
      </ul>
      <p>There are {factList.length} facts in the database. Add your own!</p>
    </section>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFactList, setShowForm }) {
  const [factText, setFactText] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("http://example.com/");
  const [isUploading, setIsUploading] = useState(false);

  const charCount = factText.length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (factText && category && source && isValidHttpUrl(source)) {
      // const newFact = {
      //   id: Math.round(Math.random() * 1000000),
      //   text: factText,
      //   source,
      //   category,
      //   votes_interesting: 0,
      //   votes_mindblowing: 0,
      //   votes_false: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      // upload new fact to supabase and get the new array of facts
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([
          {
            text: factText,
            source,
            category,
            votes_interesting: 0,
            votes_mindblowing: 0,
            votes_false: 0,
            created_in: new Date().getFullYear(),
          },
        ])
        .select();

      console.log(newFact);
      if (!error && newFact)
        setFactList((factList) => [newFact[0], ...factList]);

      setIsUploading(false);

      // reset form
      setFactText("");
      setSource("");
      setCategory("");

      // close form
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={factText}
        onChange={(e) => setFactText(e.target.value)}
      />
      <span>{200 - charCount}</span>
      <input
        type="text"
        placeholder="Trust worthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>

      <button type="submit" className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function Fact({ fact, catagories, setFacts }) {
  // const [votes_interesting, setvotes_interesting] = useState(
  //   fact.votes_interesting
  // );
  // const [votes_mindblowing, setvotes_mindblowing] = useState(
  //   fact.votes_mindblowing
  // );
  // const [votes_false, setvotes_false] = useState(fact.votes_false);

  const handleVoteInteresting = async function () {
    // update fact
    const { data, error } = await supabase
      .from("facts")
      .update({ votes_interesting: fact.votes_interesting + 1 })
      .eq("id", fact.id);

    if (!error && data)
      setFacts((prev) => prev.map((f) => (f.id === data[0].id ? data[0] : f)));
    const { data: data2, error: error2 } = await supabase
      .from("facts")
      .update({ votes_mindblowing: fact.votes_mindblowing - 1 })
      .eq("id", fact.id);

    if (!error2 && data2)
      setFacts((prev) =>
        prev.map((f) => (f.id === data2[0].id ? data2[0] : f))
      );

    const { data: data3, error: error3 } = await supabase
      .from("facts")
      .update({ votes_false: fact.votes_false - 1 })
      .eq("id", fact.id);

    if (!error3 && data3)
      setFacts((prev) =>
        prev.map((f) => (f.id === data3[0].id ? data3[0] : f))
      );
  };

  const handleVoteMindblowing = async function () {
    // update fact
    const { data, error } = await supabase
      .from("facts")
      .update({ votes_interesting: fact.votes_interesting - 1 })
      .eq("id", fact.id);

    if (!error && data)
      setFacts((prev) => prev.map((f) => (f.id === data[0].id ? data[0] : f)));

    const { data: data2, error: error2 } = await supabase
      .from("facts")
      .update({ votes_mindblowing: fact.votes_mindblowing + 1 })
      .eq("id", fact.id);

    if (!error2 && data2)
      setFacts((prev) =>
        prev.map((f) => (f.id === data2[0].id ? data2[0] : f))
      );

    const { data: data3, error: error3 } = await supabase
      .from("facts")
      .update({ votes_false: fact.votes_false - 1 })
      .eq("id", fact.id);

    if (!error3 && data3)
      setFacts((prev) =>
        prev.map((f) => (f.id === data3[0].id ? data3[0] : f))
      );
  };

  const handleVoteFalse = async function () {
    // update fact
    const { data, error } = await supabase
      .from("facts")
      .update({ votes_interesting: fact.votes_interesting - 1 })
      .eq("id", fact.id);

    if (!error && data)
      setFacts((prev) => prev.map((f) => (f.id === data[0].id ? data[0] : f)));

    const { data: data2, error: error2 } = await supabase
      .from("facts")
      .update({ votes_mindblowing: fact.votes_mindblowing - 1 })
      .eq("id", fact.id);

    if (!error2 && data2)
      setFacts((prev) =>
        prev.map((f) => (f.id === data2[0].id ? data2[0] : f))
      );

    const { data: data3, error: error3 } = await supabase
      .from("facts")
      .update({ votes_false: fact.votes_false + 1 })
      .eq("id", fact.id);

    if (!error3 && data3)
      setFacts((prev) =>
        prev.map((f) => (f.id === data3[0].id ? data3[0] : f))
      );
  };

  return (
    // <Fact key={fact.id} fact={fact} />
    <li className="fact" key={fact.id}>
      <p>
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: catagories.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={handleVoteInteresting}>
          👍 {fact.votes_interesting}
        </button>
        <button onClick={() => handleVoteMindblowing()}>
          🤯 {fact.votes_mindblowing}
        </button>
        <button onClick={() => handleVoteFalse()}>
          ⛔️ {fact.votes_false}
        </button>
      </div>
    </li>
  );
}

export default App;
