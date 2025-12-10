
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI

def calculator_tool(expression: str) -> str:
    """Evaluates a basic math expression."""
    try:
        return str(eval(expression))
    except Exception:
        return "Invalid mathematical expression."

tools = [
    Tool(
        name="Calculator",
        func=calculator_tool,
        description="Useful for evaluating simple mathematical expressions."
    )
]

llm = OpenAI(model="gpt-3.5-turbo")

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent="zero-shot-react-description",
    verbose=True
)

# Run agent query
result = agent.run("If a laptop costs $850 and I get a 15% discount, how much do I pay?")
print(result)
