using Plots, Convex, SCS, JSON, ArgParse

s = ArgParseSettings()
@add_arg_table s begin
    "-N"
    help = "number of agents to consider"
    arg_type = Int
    default = 3
    "-F"
    help = "agent utility function to use"
    default = "welfare"
    "--old"
    help = "use the original paper eq terms"
    action = :store_true
    "-K"
    help = "maximum coalition size"
    arg_type = Int
    default = 1
end
parsed_args = parse_args(ARGS, s)
K = parsed_args["K"]
N = parsed_args["N"]

# open("out.json", "r") do f
#     values = JSON.parse(f)
#     plot(values, camera=(110, 30))
#     savefig("fuck.png")
# end


# coverage welfare
w(i) = i < 1 || i > N ? 0 : 1

println(parsed_args["F"])
utilities = Dict(
    "welfare" => w,
    # marginal contribution utility
    "mc" => i -> w(i) - w(i - 1),
    # equal share
    "es" => i -> w(i) / i,
)
f = utilities[parsed_args["F"]]

function poch(a, b)
    if (a < b || a < 0 || b < 0 || a - b < 0)
        return 0
    end
    factorial(a)/factorial(a - b)
end


function doit(N, K)
    I = [(e, x, o) for e = 0:N for x = 0:N for o = 0:N if e+x+o ≤ N]
    wxo = transpose(map(((e, x, o),) -> w(x + o), I))
    wex = transpose(map(((e, x, o),) -> w(e + x), I))

    θ = Variable(length(I))
    constraints = [θ ≥ 0, sum(wex * θ) == 1]

    if (parsed_args["old"])
        # this is the equilibrium term from the two part paper.
        push!(
            constraints,
            sum(transpose(map(
                ((e, x, o),) -> e * f(e + x) - o * f(e + x + 1),
                I
            )) * θ) ≥ 0,
        )
    else
        # these are the kstrong equilibrium terms
        for ζ = 1:K
            push!(
                constraints,
                sum(transpose(
                    map(
                        ((e, x, o),) ->
                            poch(N, ζ) * w(e + x) - sum([
                                binomial(ζ, α) *
                                binomial(ζ - α, β) *
                                poch(e, α) *
                                poch(o, β) *
                                poch(N - e - o, ζ - α - β) *
                                w(e + x + β - α) for α = 0:ζ for β = 0:(ζ-α)
                            ]),
                        I,
                    ),
                ) * θ) ≥ 0,
            )
        end
    end

    maximize(sum(wxo * θ), constraints)
end

# solver = Convex.MOI.OptimizerWithAttributes(SCS.Optimizer, "max_iters" => 60000)
solver = Convex.MOI.OptimizerWithAttributes(SCS.Optimizer)


#println(solve!(doit(N, K), solver).optval)
#println(constraints)
#print(W)
#println(W.optval)


#hurr = map((k) -> solve!(doit(20, k)) [k for k=1:20]
results = [1/solve!(doit(N, k), solver, silent=true).optval for k = 1:N]
println(results)
scatter(results)
savefig("letjuliatry/" * string(N) * ".png")


# make I figure
# E = map(((e, x, o),) -> e, I)
# X = map(((e, x, o),) -> x, I)
# O = map(((e, x, o),) -> o, I)
# scatter(E, X, O, camera = (110, 30))
# savefig("I.png")
