using Plots, JSON

if length(ARGS) == 2
    open(ARGS[1], "r") do f
        values = JSON.parse(f)
        plot(values, camera=(110, 30))
        savefig(ARGS[2])
    end
else
    println("What JSON to what image?")
end
