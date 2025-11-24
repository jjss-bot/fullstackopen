function Header({ name }) {
  return (
    <h1>{name}</h1>
  );
}

function Part({ part }) {
  return (
    <p>{part.name} {part.exercises}</p>
  );
}

function Content({ parts }) {
  const cont = parts.map(part=>{
    return <Part key={part.id} part={part}/>
  });

  return (
    <>
      {cont}
    </>
  );
}

function Total({ parts }) {
  const total = parts.reduce((a,b) => {
    return { exercises: a.exercises + b.exercises };
  });

  return (
    <p>Number of exercises {total.exercises}</p>
  );
}

function Course({ course }) {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default Course;