package com.empresaarea.backend.services;

import com.empresaarea.backend.model.Voo;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class VooService {

    private final List<Voo> voos = new ArrayList<>();

    public VooService() {
        voos.add(new Voo("2025-03-25 10:00", "São Paulo", "Curitiba", "Reservado"));
        voos.add(new Voo("2025-03-25 10:00", "Sãp Paulo", "Rio de Janeiro", "Realizado"));
        voos.add(new Voo("2025-03-25 10:30", "Curitiba", "São Paulo", "Cancelado"));
    }

    public List<Voo> listarTodos() {
        return voos.stream()
                .sorted(Comparator.comparing(Voo::getDataHora))
                .toList();
    }

    public Optional<Voo> buscarReserva(String dataHora) {
        return voos.stream()
                .filter(v -> v.getDataHora().equals(dataHora) && v.getStatus().equalsIgnoreCase("Reservado"))
                .findFirst();
    }

    public boolean cancelarReserva(String dataHora) {
        Optional<Voo> voo = buscarReserva(dataHora);
        voo.ifPresent(v -> v.setStatus("Cancelado"));
        return voo.isPresent();
    }
}
